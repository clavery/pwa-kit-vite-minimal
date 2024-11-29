import type {Route} from "./+types/home";
import App from "../App";

export function meta(_args: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}

export default function Home() {
    return <App/>;
}