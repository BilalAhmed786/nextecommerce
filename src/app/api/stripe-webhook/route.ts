import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { sendOrderEmail } from '@/nodemailer/orderplace';

const prisma = new PrismaClient();

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY missing in environment");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any,
  });

  const rawBody = await req.arrayBuffer();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }


  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const {
        userId,
        guestName,
        guestEmail,
        cartItems,
        address,
        subTotal,
        paymentMethod,
        shippingCost,
        total,
      } = session.metadata as any;

      const parsedAddress = JSON.parse(address);
      const parsedItems = JSON.parse(cartItems);

      const createdAddress = await prisma.address.create({
        data: {
          userId: userId || null,
          name: guestName,
          email: guestEmail,
          street: parsedAddress.street,
          city: parsedAddress.city,
          state: parsedAddress.state,
          postalCode: parsedAddress.postalCode,
          country: parsedAddress.country,
        },
      });

      const createdOrder = await prisma.order.create({
        data: {
          userId: userId || null,
          addressId: createdAddress.id,
          subtotal: parseFloat(subTotal),
          shippingCost: parseFloat(shippingCost),
          total: parseFloat(total),
          payment: paymentMethod,
          orderItems: {
            create: parsedItems.map((item: any) => ({
              productId: item.id,
              quantity: item.Qty,
              price: item.price,
            })),
          },
        },
      });

      await sendOrderEmail({
        to: guestEmail,
        name: guestName,
        orderId: createdOrder.id,
        total: parseFloat(total),
      });

      console.log('Stripe payment processed and order saved.');
    } catch (err) {
      console.error('Error processing Stripe webhook:', err);
    }
  }

  return NextResponse.json({ received: true });
}
