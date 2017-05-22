import React from 'react';
import axios from 'axios';
import { Table, Popover, Overlay } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class InsuranceDoctors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            insuranceDoctor: {
                doctorInsuranceId: 0,
                doctorId: 0,
                name: "",
                credentials: "",
                applicationStatusId: 0,
                effectiveDate: null,
                notes: "",
                applicationStatusHistory: []
            },
            selectedApplicationStatus: "",
            selectedRow: null,
            selectedColumn: null,
            tabIndex: 0,
            anyChanges: false,
            show: false,
            target: null,
            selectedApplicationStatusHistory: 0,
        }
        this.showEditor = this.showEditor.bind(this);
    }

    async changeHandler(e) {
        let insuranceDoctor = this.state.insuranceDoctor;
        insuranceDoctor[e.target.name] = e.target.value === '' ? null : e.target.value;
        this.setState({insuranceDoctor: insuranceDoctor, anyChanges: true});
    }

    async onBlur() {
        if(this.state.anyChanges) {
            await axios.post('/api/doctors/editdoctorinsurance', this.state.insuranceDoctor);
            this.props.refresh();
        }
    }

    showApplicationStatusHistory(e, insuranceDoctor) {
      this.setState({ target: e.target, show: !this.state.show, selectedApplicationStatusHistory: insuranceDoctor.doctorInsuranceId });
    }

    showEditor(column, insuranceDoctor) {
        event.preventDefault();
        let render;

        let columnText = insuranceDoctor[column] || '';

        if(this.state.selectedRow === insuranceDoctor.doctorInsuranceId && this.state.selectedColumn === column) {
            if(column === "notes") {
                render = <textarea name="notes" onChange={(e) => this.changeHandler(e)} onBlur={() => this.onBlur()} defaultValue={columnText} className="form-control" autoFocus={true}/>
            }
            else if(this.state.selectedColumn === "effectiveDate")
            {
                render = <input type="date" name="effectiveDate" onChange={(e) => this.changeHandler(e)} onBlur={() => this.onBlur()} defaultValue={columnText} className="form-control" autoFocus={true}/>
            }
            else if(column === "applicationStatusId")
            {
                render = <select name="applicationStatusId" onChange={(e) => this.changeHandler(e)} onBlur={() => this.onBlur()} value={columnText} className="form-control" autoFocus={true}>
                            {this.props.applicationStatuses.map(s => <option key={s.applicationStatusId} value={s.applicationStatusId}>{s.applicationStatus}</option>)} 
                         </select>                
            }
        }

        else {
            render = column === "applicationStatusId" ? 
                <div>
                    <p>
                        <span className="glyphicon glyphicon-info-sign" onMouseOver={(e) => this.showApplicationStatusHistory(e, insuranceDoctor)} onMouseLeave={() => this.setState({show: !this.state.show})}></span>
                        {this.props.applicationStatuses.find(a => a.applicationStatusId == columnText).applicationStatus}
                        
                        <Overlay
                            show={this.state.selectedApplicationStatusHistory === insuranceDoctor.doctorInsuranceId && this.state.show ? true : false}
                            target={this.state.target}
                            placement="top"
                        >
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
                                    {insuranceDoctor.applicationStatusHistory.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                                        insuranceDoctor.applicationStatusHistory.map((a, i) => this.createHistoryRow(a, i))}
                                </tbody>
                            </table>
                        </Popover>
                        </Overlay>
                    </p> 
                </div> : <p>{columnText}</p>;
        }

        return (
            <div>
                {render}
            </div>
        );
    }
    
    columnClick(selectedColumn, insuranceDoctor) {
        this.setState({selectedColumn: selectedColumn, selectedRow: insuranceDoctor.doctorInsuranceId, insuranceDoctor: insuranceDoctor, anyChanges: false});
    }

    createInsuranceDoctorRow(insuranceDoctor)
    {
        return(
            <tr key={insuranceDoctor.doctorInsuranceId}>
                <td className="hidden">{insuranceDoctor.doctorInsuranceId}</td>
                <td className="link"><Link to={`/DoctorDetails/${insuranceDoctor.doctorId}`}>{insuranceDoctor.name + ", " + insuranceDoctor.credentials}</Link></td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "applicationStatusId", insuranceDoctor)}>{this.showEditor("applicationStatusId", insuranceDoctor)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "effectiveDate", insuranceDoctor)}>{this.showEditor("effectiveDate", insuranceDoctor)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "notes", insuranceDoctor)}>{this.showEditor("notes", insuranceDoctor)}</td>
            </tr>
        )
    }

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
            <div className="formContainer">
                <h4>Doctors</h4>
                <hr />
                <div className="btn-group pull-right">
                    <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn"
                            table="insuranceDoctorsTable"
                            filename={this.props.insurance + "Doctors"}
                            sheet="insuranceDoctorsTable"
                            buttonText="Export to Excel"/>
                </div>
                <table id="insuranceDoctorsTable" className="table">
                    <thead>
                        <tr className="header">
                            <th className="hidden">DoctorInsuranceId</th>
                            <th>Doctor</th>
                            <th>Application Status</th>
                            <th>Effective Date</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.insurances.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                            this.props.insurances.map(i => this.createInsuranceDoctorRow(i))}
                    </tbody>
                </table>
            </div>
        )
    }
}