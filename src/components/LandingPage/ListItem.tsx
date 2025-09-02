


import { ReactNode } from "react";

interface ListItemProps {
    children: ReactNode;
    NavLink: string;
}

const ListItem = ({ children, NavLink }: ListItemProps) => {
    return (
        <>
            <li>
                <a
                    href={NavLink}
                    className="flex py-2 text-base font-medium text-dark hover:text-brand-500 dark:text-white lg:ml-10 lg:inline-flex"
                >
                    {children}
                </a>
            </li>
        </>
    );
};


export default ListItem;