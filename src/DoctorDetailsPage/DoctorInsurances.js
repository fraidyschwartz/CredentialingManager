import React from 'react';
import axios from 'axios';
import { Popover, Overlay } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class DoctorInsurances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorInsurance: {
                doctorInsuranceId: 0,
                insuranceId: 0,
                insurance: "",
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
        let doctorInsurance = this.state.doctorInsurance;
        doctorInsurance[e.target.name] = e.target.value === '' ? null : e.target.value;
        this.setState({doctorInsurance: doctorInsurance, anyChanges: true});
    }

    async onBlur() {
        if(this.state.anyChanges) {
            await axios.post('/api/doctors/editdoctorinsurance', this.state.doctorInsurance);
            this.props.refresh();
        }
    }

    showApplicationStatusHistory(e, doctorInsurance) {
      this.setState({ target: e.target, show: !this.state.show, selectedApplicationStatusHistory: doctorInsurance.doctorInsuranceId });
    }

    showEditor(column, doctorInsurance) {
        event.preventDefault();
        let render;

        let columnText = doctorInsurance[column] || '';

        if(this.state.selectedRow === doctorInsurance.doctorInsuranceId && this.state.selectedColumn === column) {
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
                        <span className="glyphicon glyphicon-info-sign" onMouseOver={(e) => this.showApplicationStatusHistory(e, doctorInsurance)} onMouseLeave={() => this.setState({show: !this.state.show})}></span>
                        {this.props.applicationStatuses.find(a => a.applicationStatusId == columnText).applicationStatus}
                        
                        <Overlay
                            show={this.state.selectedApplicationStatusHistory === doctorInsurance.doctorInsuranceId && this.state.show ? true : false}
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
                                    {doctorInsurance.applicationStatusHistory.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                                        doctorInsurance.applicationStatusHistory.map((a, i) => this.createHistoryRow(a, i))}
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
    
    columnClick(selectedColumn, doctorInsurance) {
        this.setState({selectedColumn: selectedColumn, selectedRow: doctorInsurance.doctorInsuranceId, doctorInsurance: doctorInsurance, anyChanges: false});
    }

    createDoctorInsuranceRow(doctorInsurance)
    {
        return(
            <tr key={doctorInsurance.doctorInsuranceId}>
                <td className="hidden">{doctorInsurance.doctorInsuranceId}</td>
                <td className="link"><Link to={`/InsuranceDetails/${doctorInsurance.insuranceId}`}>{doctorInsurance.insurance}</Link></td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "applicationStatusId", doctorInsurance)}>{this.showEditor("applicationStatusId", doctorInsurance)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "effectiveDate", doctorInsurance)}>{this.showEditor("effectiveDate", doctorInsurance)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "notes", doctorInsurance)}>{this.showEditor("notes", doctorInsurance)}</td>
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
                <h4>Insurances</h4>
                <hr />
                <div className="btn-group pull-right">
                    <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn"
                            table="doctorsInsuranceTable"
                            filename={this.props.doctor + "Insurances"}
                            sheet="doctorsInsuranceTable"
                            buttonText="Export to Excel"/>
                </div>
                <table id="doctorsInsuranceTable" className="table">
                    <thead>
                        <tr className="header">
                            <th className="hidden">DoctorInsuranceId</th>
                            <th>Insurance</th>
                            <th>Application Status</th>
                            <th>Effective Date</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.insurances.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                            this.props.insurances.map(i => this.createDoctorInsuranceRow(i))}
                    </tbody>
                </table>
            </div>
        )
    }
}

/*export default class DoctorInsurances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorInsurance: {
                doctorInsuranceId: 0,
                insurance: null,
                applicationStatusId: 0,
                effectiveDate: null,
                notes: null
            },
            insurances: [],
        }
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    }

    async componentDidMount() {
        let insurances = this.props.insurances;
        this.setState({insurances});            
    }

    onAfterSaveCell(value, name) {
        event.preventDefault();
        console.log('start after');
        console.log(value[name]);
        console.log(this.state.doctorInsurance);
        console.log(this.state.prevCellVal);
        let insurance = this.state.insurances.find(i => i.doctorInsuranceId === value.doctorInsuranceId); 
        if(this.state.doctorInsurance[name] !== value[name])
        {
            this.setState({doctorInsurance: value}, () => {
                axios.post('/api/doctors/editdoctorinsurance', this.state.doctorInsurance);
                //let doctorInsurances = await axios.get('/api/doctors/getDoct')
            });
        }
        console.log('end after');
    }

    onBeforeSaveCell(row, cellName, cellValue) {
        event.preventDefault();
        console.log('start before');
        this.setState({doctorInsurance: row}, () => {
            console.log(this.state.prevCellVal);
        });
        console.log('end before');
       //this.setState({doctorInsurance: row});
    }

    render() {
        // console.log(this.props.insurances);
        var selectRowProp = {
            clickToSelect: true
        };

        var cellEditProp = {
            mode: "click",
            beforeSaveCell: this.onBeforeSaveCell,
            afterSaveCell: this.onAfterSaveCell
        };
        
        return (
              <BootstrapTable selectRow={selectRowProp} data={this.props.insurances}  cellEdit={ cellEditProp } hover={true}>
                <TableHeaderColumn hidden editable={ false } isKey={true} dataField="doctorInsuranceId" dataSort={true}>Doctor Insurance ID</TableHeaderColumn>
                <TableHeaderColumn dataField="insurance" editable={ false } dataSort={true}>Insurance</TableHeaderColumn>
                <TableHeaderColumn dataField="applicationStatusId" dataSort={true}>Application Status</TableHeaderColumn>
              </BootstrapTable>
        )
    }
}*/