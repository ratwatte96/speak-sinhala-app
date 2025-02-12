"use client";
import { Heart, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { useSharedState } from "@/components/StateProvider";
import RefillModal from "./RefillModal";
import Modal from "./Modal";

const Shop = () => {
  const [showRefillModal, setShowRefillModal] = useState<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [useRefill, setUseRefill] = useState<boolean>(false);
  const [buyRefill, setBuyRefill] = useState<boolean>(false);
  const [buyPremium, setBuyPremium] = useState<boolean>(false);
  const [refillTotal, setRefillTotal] = useState<any>(0);
  const [refillMessage, setRefillMessage] = useState<string>("");
  const [premiumType, setPremiumType] = useState<any>("");
  const [premiumMessage, setPremiumMessage] = useState<string>("");

  const { setSharedState } = useSharedState();

  const items = [
    { type: "Refill", amount: 1 },
    { type: "Refill", amount: 5 },
    { type: "Refill", amount: 10 },
    { type: "Premium", amount: 1 },
    { type: "Premium", amount: 12 },
    { type: "Premium", amount: "lifetime" },
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

    if (buyPremium) {
      const updatePremium = async (type: any) => {
        const res = await fetchWithToken("/api/premium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log(data.total_refill);
          setPremiumMessage("Premium Activated");
        } else {
          setPremiumMessage(data.error);
        }
        setBuyPremium(false);
        return data;
      };
      updatePremium(premiumType);
    }
  }, [useRefill, buyRefill, buyPremium]);

  return (
    <div className="min-h-screen">
      <h1 className="text-xl font-bold pt-[8px]">SHOP</h1>
      <h2 className="text-lg font-semibold mt-4">Refills</h2>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {items
          .filter((item) => item.type === "Refill")
          .map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
              onClick={() => {
                setShowRefillModal(true);
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
              onClick={() => {
                setPremiumType(
                  item.amount === 1
                    ? "1_month"
                    : item.amount === 12
                    ? "12_months"
                    : null
                );
                setShowPremiumModal(true);
              }}
            >
              <Crown className="text-yellow-500" size={40} />
              <p className="mt-2 font-semibold">
                Month
                {typeof item.amount != "number"
                  ? item.amount
                  : item.amount > 1
                  ? "s"
                  : ""}
                x {item.amount}
              </p>
            </div>
          ))}
      </div>

      <RefillModal
        show={showRefillModal}
        onClose={() => {
          setUseRefill(false);
          setBuyRefill(false);
          setRefillTotal(0);
          setRefillMessage("");
          setShowRefillModal(false);
        }}
        onBuyRefill={() => setBuyRefill(true)}
        onUseRefill={() => setUseRefill(true)}
        refillMessage={refillMessage}
        disableBuy={buyRefill}
        disableUse={useRefill}
      />
      <Modal
        show={showPremiumModal}
        onClose={() => {
          setBuyPremium(false);
          setPremiumType("");
          setPremiumMessage("");
          setShowPremiumModal(false);
        }}
        heading={"Note"}
      >
        <div>
          <button
            onClick={() => setBuyPremium(true)}
            className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
            disabled={buyPremium}
          >
            Buy Premium: {premiumType}
          </button>
        </div>
        <p>{premiumMessage}</p>
      </Modal>
    </div>
  );
};

export default Shop;
