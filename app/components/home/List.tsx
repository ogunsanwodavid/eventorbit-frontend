interface ListProps {
  listItems: string[];
}

export default function List({ listItems }: ListProps) {
  return (
    <ul className="flex flex-col gap-y-8">
      {listItems.map((item, index) => {
        return (
          <li key={index} className="flex gap-x-4 shrink-0">
            {/** List disc */}
            <span className="inline-block w-3 h-3 bg-teal rounded-full shrink-0"></span>

            {/** List text */}
            <p className="text-gray text-lg font-medium -mt-2 md:text-xl">
              {item}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
