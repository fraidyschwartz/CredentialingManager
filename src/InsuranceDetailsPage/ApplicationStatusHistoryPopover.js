import React from 'react';
import { Popover, Overlay } from 'react-bootstrap';

export default class ApplicationStatusHistoryPopover extends React.Component {
    
    createHistoryRow(applicationStatusHistory, index)
    {
        return(
            <tr key={index}>
                <td>{applicationStatusHistory.applicationStatus}</td>
                <td>{applicationStatusHistory.assignedDate}</td>
                <td>{applicationStatusHistory.assignedBy}</td>
            </tr>
        )
    }

    render() {
        return (
            <Overlay
                show={this.props.selectedApplicationStatusHistory === this.props.insuranceDoctor.doctorInsuranceId && this.props.show ? true : false}
                target={this.props.target}
                placement="top">
                <Popover  id="popover-contained" title="Application Status History">
                    <table className="table">
                        <thead>
                            <tr className="header">
                                <th>Application Status</th>
                                <th>Assigned Date</th>
                                <th>Assigned By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.insuranceDoctor.applicationStatusHistory.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                                this.props.insuranceDoctor.applicationStatusHistory.map((a, i) => this.createHistoryRow(a, i))}
                        </tbody>
                    </table>
                </Popover>
            </Overlay>
        )
    }
}