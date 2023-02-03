import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";

export const loader = async () => {
  return json({});
};

export default function Index() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
