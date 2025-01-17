// import "../css/TestListPage.css"; // Import the styles

export const UnitSelctComponent = ({ unit }: { unit: string }) => {
  return (
    <>
      <h1>{unit.split("Test.json")[0]}</h1>
      <p className="descriptionUnitTest">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facere
        natus tempora corrupti beatae! Iure omnis molestias nisi autem
        distinctio
      </p>
    </>
  );
};