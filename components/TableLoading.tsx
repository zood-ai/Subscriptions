interface TableLoadingProps {
  title: string;
}

const TableLoading: React.FC<TableLoadingProps> = ({ title }) => {
  return <div>Table ({title}) is Loading</div>;
};

export default TableLoading;
