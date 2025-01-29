import { Heart, Crown } from "lucide-react";

const Shop = () => {
  const items = [
    { type: "Refill", amount: 1 },
    { type: "Refill", amount: 5 },
    { type: "Refill", amount: 10 },
    { type: "Premium", amount: 1 },
    { type: "Premium", amount: 12 },
  ];

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
    </div>
  );
};

export default Shop;
