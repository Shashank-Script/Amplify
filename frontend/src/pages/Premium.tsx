
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCrown, FaHeadphones, FaStar } from "react-icons/fa";

const plans = [
  {
    id: 1,
    title: "Free Plan",
    price: "₹0 / month",
    icon: <FaHeadphones className="text-green-400 text-3xl" />,
    features: [
      "Shuffle play only",
      "Limited skips",
      "Ads between songs",
      "Standard audio quality",
    ],
    buttonText: "Current Plan",
    highlighted: false,
  },
  {
    id: 2,
    title: "Premium Individual",
    price: "₹119 / month",
    icon: <FaCrown className="text-yellow-400 text-3xl" />,
    features: [
      "Ad-free music listening",
      "Unlimited skips",
      "Download songs offline",
      "High audio quality",
    ],
    buttonText: "Get Premium",
    highlighted: true,
  },
  {
    id: 3,
    title: "Family Plan",
    price: "₹179 / month",
    icon: <FaStar className="text-pink-400 text-3xl" />,
    features: [
      "Up to 6 accounts",
      "Parental controls",
      "Ad-free music",
      "Shared family playlist",
    ],
    buttonText: "Subscribe",
    highlighted: false,
  },
];

const Premium = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#121212] text-white flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-extrabold mb-3 text-center">
        Go Premium. Unlock the Full Experience.
      </h1>
      <p className="text-gray-400 mb-10 text-center max-w-xl">
        Choose a plan that suits you best. Enjoy ad-free, high-quality music anytime, anywhere.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#232323] transition-all duration-300 p-4 shadow-lg ${
              plan.highlighted ? "border-green-400 scale-[1.02]" : ""
            }`}
          >
            <CardHeader className="flex flex-col items-center">
              <div className="mb-4">{plan.icon}</div>
              <CardTitle className="text-2xl font-bold mb-2">{plan.title}</CardTitle>
              <CardDescription className="text-gray-400 text-lg">{plan.price}</CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="text-gray-300 text-sm space-y-3 mt-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">✔</span> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex justify-center mt-6">
              <Button
                variant={plan.highlighted ? "default" : "secondary"}
                className={`w-full py-2 rounded-full font-semibold ${
                  plan.highlighted
                    ? "bg-green-500 hover:bg-green-400 text-black"
                    : "bg-[#2a2a2a] hover:bg-[#333] text-white"
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Premium;
