import { auth } from "@clerk/nextjs/server";
import Settings from "./settings";
import Home from "./home";


export default async function Index() {
  const { userId } = await auth()  

  if(userId) return <Settings />
  else return <Home />
}