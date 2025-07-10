import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { sendOrderEmail } from '@/nodemailer/mailer';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body)
  const {
    userId,
    guestName,
    guestEmail,
    cartItems,
    address,
    subTotal,
    shippingCost,
    total,
    paymentMethod,
  } = body;

  // Helper to store order in DB
  const storeOrderInDatabase = async () => {
    const createdAddress = await prisma.address.create({
      data: {
        userId: userId || null,
        name: guestName,
        email: guestEmail,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
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
          create: cartItems.map((item: any) => ({
            productId: item.id,
            quantity: item.Qty,
            price: item.price,
          })),
        },
      },
    });

    return { createdOrder, createdAddress };
  };

  if (paymentMethod === 'COD') {
    try {
      const { createdOrder } = await storeOrderInDatabase();

      // Send confirmation email
      await sendOrderEmail({
        to: guestEmail,
        name: guestName,
        orderId: createdOrder.id,
        total: parseFloat(total),
      });

      return NextResponse.json({ sessionId: '' });
    } catch (error) {
      console.error('Error placing COD order:', error);
      return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
  }

  // Stripe Payment Flow (data will be saved after webhook confirms payment)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: guestEmail,
      line_items: [
        ...cartItems.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: `Product: ${item.id}` },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.Qty,
        })),
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Shipping (${address.city})` },
            unit_amount: Math.round(shippingCost * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || '',
        guestName,
        guestEmail,
        cartItems: JSON.stringify(cartItems),
        address: JSON.stringify(address),
        subTotal: subTotal,
        shippingCost: shippingCost,
        total: total,
        paymentMethod
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
}
