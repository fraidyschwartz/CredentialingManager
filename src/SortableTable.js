import React from 'react';
import { Table } from 'react-bootstrap';

export default class SortableTable extends React.Component {
    render() {
        return (
            <Table id={this.props.tableName}>
                <thead>
                    <tr className="header">
                        {this.props.headers.map(h => 
                            <th key={h.columnName} onClick={this.props.sortColumn.bind(this, h.columnName, false)} className={h.hidden === true ? 'hidden' : ''}>
                                {h.displayName}
                                <span className="glyphicon glyphicon-sort"/>
                            </th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.rows.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                        this.props.rows.map(r => this.props.createRow(r))}
                </tbody>
            </Table>
        )
    }
}