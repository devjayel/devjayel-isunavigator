import { Link } from "@inertiajs/react";

export default Pagination = ({ links }) => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-row">
                {links.map((link) => (
                    link.url ?
                        <Link
                            key={link.label}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`${link.active ? 'bg-blue-500' : 'bg-gray-300'} px-4 py-2 mx-1 rounded`}
                        />
                        :
                        <span
                            key={link.label}
                            className="px-4 py-2 mx-1 bg-gray-300 rounded"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                ))}
            </div>
        </div>
    );
};