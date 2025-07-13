'use client'


const searchdatatable  = ({ search }:{search:(query:string)=>void}) => {
    return (

        <div className="block m-7">
            <input
                type="text"
                placeholder="Search products..."

                onChange={(e) => search(e.target.value)}
                className="block w-[80%]  m-auto h-12 rounded-2xl p-4 outline-none border-1"
            />
        </div>
    )
}

export default searchdatatable