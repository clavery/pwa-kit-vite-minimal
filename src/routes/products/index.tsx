import type { Route } from "./+types/index"
import pkg from "commerce-sdk-isomorphic"
const { helpers, ShopperLogin, ShopperSearch } = pkg
import { config } from "@/state/auth.ts"
import DefaultLayout from "../_layout.tsx"
import { Link } from "react-router"

export function meta(_args: Route.MetaArgs) {
    return [{ title: "Product Search" }]
}

export async function loader({}: Route.LoaderArgs) {
    const { access_token } = await helpers.loginGuestUserPrivate(
        new ShopperLogin(config),
        {},
        {
            clientSecret: config.parameters.clientSecret,
        }
    )

    const shopperSearch = new ShopperSearch({
        ...config,
        headers: { authorization: `Bearer ${access_token}` },
    })

    const searchResult = await shopperSearch.productSearch({
        parameters: { refine: ["cgid=root"], q: "shirt" },
    })
    return { searchResult }
}

export default function Products({ loaderData }: Route.ComponentProps) {
    return (
        <DefaultLayout>
            <div className="max-w-[800px] mx-auto my-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                    {loaderData.searchResult?.hits.map((product) => (
                        <div
                            key={product.productId}
                            className="w-full max-w-[250px] flex flex-col items-center"
                        >
                            <div className="flex justify-center">
                                <Link to={`/products/${product.productId}`}>
                                    <img
                                        src={product.image?.link}
                                        alt=""
                                        className="max-w-[200px]"
                                    />
                                </Link>
                            </div>
                            <div className="flex justify-items-center">
                                <Link to={`/products/${product.productId}`}>
                                    {product.productName}
                                </Link>
                            </div>
                            <div className="flex justify-items-center">
                                ${product.price}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}
