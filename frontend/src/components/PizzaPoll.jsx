import * as React from "react";
import { PizzaOption } from "./PizzaOption";

export function PizzaPoll() {
  const pizzaOptions = ["Pineapples", "Just cheese", "Sausage", "Pepperoni"];

  return (
    <form className="flex overflow-hidden flex-col items-center pr-2 pl-2.5 max-w-xs text-black bg-black">
      <div className="flex flex-col pt-4 w-full text-xl">
        <label className="self-start text-3xl text-center text-neutral-500">
          What superior topping belongs on a pizza?
        </label>
        {pizzaOptions.map((option, index) => (
          <PizzaOption key={index} optionText={option} />
        ))}
      </div>
      <div className="mt-6 text-xs text-neutral-500">62 votes</div>
      <button
        type="submit"
        className="gap-2.5 px-1 py-2 mt-6 max-w-full text-3xl text-center whitespace-nowrap rounded-3xl bg-neutral-500 min-h-[51px] tracking-[3.6px] w-[196px]"
      >
        Vote
      </button>
    </form>
  );
}
export default PizzaPoll;