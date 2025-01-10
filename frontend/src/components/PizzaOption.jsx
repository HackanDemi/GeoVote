

export function PizzaOption({ optionText }) {
  return (
    <div className="flex flex-col mt-4 w-full whitespace-nowrap">
      <div className="px-2.5 py-5 bg-neutral-500">{optionText}</div>
    </div>
  );
}