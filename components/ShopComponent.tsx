"use client";
import { Heart, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchWithToken } from "@/utils/fetch";
import { useSharedState } from "@/components/StateProvider";

const Shop = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [useRefill, setUseRefill] = useState<boolean>(false);
  const [buyRefill, setBuyRefill] = useState<boolean>(false);
  const [refillMessage, setRefillMessage] = useState<string>("");
  const { sharedState, setSharedState } = useSharedState();

  const items = [
    { type: "Refill", amount: 1 },
    { type: "Refill", amount: 5 },
    { type: "Refill", amount: 10 },
    { type: "Premium", amount: 1 },
    { type: "Premium", amount: 12 },
  ];

  useEffect(() => {
    if (useRefill) {
      const refill = async () => {
        try {
          const response: any = await fetchWithToken(`/api/refill?quizId=0`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseData = await response.json();
          if (response.ok) {
            setSharedState(responseData.total_lives);
            console.log(setSharedState);
            setRefillMessage("Refill Successful");
            setShowModal(false);
          } else {
            setRefillMessage("Refill Failed");
          }
        } catch (error: any) {
          console.log(error);
        }
      };
      refill();
    }
  }, [useRefill]);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-bold">SHOP</h1>
      <h2 className="text-lg font-semibold mt-4">Refills</h2>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {items
          .filter((item) => item.type === "Refill")
          .map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
              onClick={() => setShowModal(true)}
            >
              <Heart className="text-red-500" size={40} />
              <p className="mt-2 font-semibold">Refill x {item.amount}</p>
            </div>
          ))}
      </div>

      <h2 className="text-lg font-semibold mt-6">Premium</h2>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {items
          .filter((item) => item.type === "Premium")
          .map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <Crown className="text-yellow-500" size={40} />
              <p className="mt-2 font-semibold">
                Month{item.amount > 1 ? "s" : ""} x {item.amount}
              </p>
            </div>
          ))}
      </div>

      {showModal && (
        <Modal
          show={showModal}
          onClose={() => {
            setUseRefill(false);
            setRefillMessage("");
            setShowModal(false);
          }}
          heading={"Note"}
        >
          <div>
            {/* <button
              onClick={refill}
              className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
            >
              Add Refill
            </button> */}
            <button
              onClick={() => setUseRefill(true)}
              className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
            >
              Use Refill
            </button>
          </div>
          <p>{refillMessage}</p>
        </Modal>
      )}
    </div>
  );
};

export default Shop;
