import {FC} from 'react';

import {Treeview} from '../Treeview';

const Sidebar: FC = () => {
  return (
    <div className="h-full w-full bg-gray-800 border-r border-gray-500">
      <Treeview />
    </div>
  );
};

export default Sidebar;
