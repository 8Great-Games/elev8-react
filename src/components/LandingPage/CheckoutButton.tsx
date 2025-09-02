
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/axios";

// publishable key (Stripe dashboard → Developers → API keys → Publishable key)
const stripePromise = loadStripe("pk_test_51RUZkwRsHcAwQpDBKIr7UxoxliqVH04Sbo81EnddmO2SDD8R4AZ73EgZK1z7RSy3GZkuNT5DVzq0CiNjRvTW2vw100I4FYaSHg");

function CheckoutButton({ planName }: { planName: string }) {
  const handleCheckout = async () => {
    // backend'e istek at → checkout session oluştur
    const res = await api.post("/subscriptions/create-checkout-session", {
      planName,
    });
    const { id } = res.data;

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <button onClick={handleCheckout} className="mt-8 w-full rounded-2xl bg-[#3b82f6] px-5 py-3 text-white shadow hover:bg-[#2563eb]">
      Subscribe Now
    </button>
  );
}

export default CheckoutButton;
