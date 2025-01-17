// import "../css/TestListPage.css"; // Import the styles

export const UnitSelctComponent = ({ unit }: { unit: string }) => {
  return (
    <>
      <h1>{unit.split("Test.json")[0]}</h1>
      <p className="text-sm text-gray-300 text-center mt-2 mb-2 max-w-[400px] mx-auto p-2 bg-[#2f3134] rounded-lg leading-6">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facere
        natus tempora corrupti beatae! Iure omnis molestias nisi autem
        distinctio
      </p>
    </>
  );
};
