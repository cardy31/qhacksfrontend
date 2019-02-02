import * as React from 'react';

// Stolen from here: https://engineering.shopify.com/blogs/engineering/building-data-table-component-react
export default function Cell({
                                 content,
                             }) {
    return (
        <td className="Cell">
            {content}
        </td>
    );
}