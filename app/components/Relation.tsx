type Props = {
  relation: number[][];
  togglePair: (i: number, j: number) => void;
};

const Relation: React.FC<Props> = ({ relation, togglePair }) => {
  return (
    <div className="flex flex-col gap-1">
      {relation.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((cell, j) => (
            <button
              onClick={() => togglePair(i, j)}
              key={`${i}${j}`}
              className={`h-16 w-16 rounded transition-colors duration-200 ${
                cell
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-300 hover:bg-gray-200"
              }`}
            ></button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Relation;
