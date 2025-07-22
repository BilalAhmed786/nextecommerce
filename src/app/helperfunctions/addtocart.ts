export function addtocart(product: any) {
   
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const exists = cart.some((prod: any) => prod.id === product.id)

    if (exists) {

        const updatedCart = cart.map((prod: any) =>
            prod.id === product.id && prod.Qty < prod.stock ?
                {
                    ...prod,
                    Qty: prod.Qty + 1,
                    total: product.price * (prod.Qty + 1)
                } : prod

        )

        localStorage.setItem('cart', JSON.stringify(updatedCart));


    } else {

        const updatedCart = [...cart, {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            stock: product.stock,
            Qty: 1,
            total: product.price * 1


        }]


        localStorage.setItem('cart', JSON.stringify(updatedCart));

    }

    window.dispatchEvent(new Event('cartChanged'));



}