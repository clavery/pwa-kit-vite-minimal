import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/test": {};
  "/products": {};
  "/products/:pid": {
    "pid": string;
  };
};