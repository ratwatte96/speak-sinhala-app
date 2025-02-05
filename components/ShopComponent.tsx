"use client";
import { Heart, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { useSharedState } from "@/components/StateProvider";
import RefillModal from "./RefillModal";

const Shop = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [useRefill, setUseRefill] = useState<boolean>(false);
  const [buyRefill, setBuyRefill] = useState<boolean>(false);
  const [refillTotal, setRefillTotal] = useState<number>(0);
  const [refillMessage, setRefillMessage] = useState<string>("");

  const { setSharedState } = useSharedState();

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
            setSharedState("lives", responseData.total_lives);
            setRefillMessage("Refill Successful");
          } else {
            setRefillMessage(responseData.error);
          }
        } catch (error: any) {
          console.log(error);
        }
      };
      refill();
    }

    if (buyRefill) {
      const updateRefill = async (newTotal: number) => {
        const res = await fetchWithToken("/api/buy-refill", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newTotal }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log(data.total_refill);
          setSharedState("refills", data.total_refill);
          setRefillMessage("Refill Purchased");
        } else {
          setRefillMessage(data.error);
        }
        return data;
      };
      updateRefill(refillTotal);
    }
  }, [useRefill, buyRefill]);

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
              onClick={() => {
                setShowModal(true);
                setRefillTotal(item.amount);
              }}
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

      <RefillModal
        show={showModal}
        onClose={() => {
          setUseRefill(false);
          setBuyRefill(false);
          setRefillTotal(0);
          setRefillMessage("");
          setShowModal(false);
        }}
        onBuyRefill={() => setBuyRefill(true)}
        onUseRefill={() => setUseRefill(true)}
        refillMessage={refillMessage}
        disableBuy={buyRefill}
        disableUse={useRefill}
      />
    </div>
  );
};

export default Shop;
