import React from 'react';
import axios from 'axios';
import InsuranceContactAddNewModal from './InsuranceContactAddNewModal';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class InsuranceContactsTable extends React.Component {
    constructor() {
        super();
        this.state = {
            insuranceContact: {
                insuranceContactId: 0,
                insuranceId: 0,
                title: '',
                firstName: '',
                lastName: '',
                phone: '',
                ext: '',
                fax: '',
                email: '',
            },
            contacts: [],
            selectedRow: null,
            selectedColumn: null,
            tabIndex: 0,
            anyChanges: false,
            showModal: false
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.createInsuranceContact = this.createInsuranceContact.bind(this);
        this.deleteInsuranceContact = this.deleteInsuranceContact.bind(this);
    }

    componentDidMount() {
        this.getInsuranceContact();
        this.setState({insuranceContact : {insuranceId : this.props.insuranceId}});
    }

    async getInsuranceContact() {
        let contacts = await axios.get('/api/insurances/getinsurancecontacts?insuranceId=' + this.props.insuranceId);
        this.setState({contacts: contacts.data})
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true, insuranceContact: {insuranceContactId: 0, insuranceId: this.props.insuranceId}});
    }

    changeHandler(e) {
        let insuranceContact = this.state.insuranceContact;
        insuranceContact[e.target.name] = e.target.value === '' ? null : e.target.value;
        this.setState({insuranceContact: insuranceContact, anyChanges: true});
    }

    async onBlur() {
        if(this.state.anyChanges) {
            await axios.post('/api/insurances/editinsurancecontact', this.state.insuranceContact);
            this.getInsuranceContact();
        }
    }

    async createInsuranceContact(e) {
        e.preventDefault();
        await axios.post('/api/insurances/newinsurancecontact', this.state.insuranceContact);
        this.getInsuranceContact();
        this.close();
    }

    async deleteInsuranceContact() {
        event.preventDefault();
        await axios.post('/api/insurances/deleteinsurancecontact', {insuranceContactId : this.state.selectedRow});
        this.getInsuranceContact();
        this.setState({selectedRow: null});
    }

    showEditor(column, insuranceContact) {
        event.preventDefault();
        let render;

        let columnText = insuranceContact[column] || '';

        if(this.state.selectedRow === insuranceContact.insuranceContactId && this.state.selectedColumn === column) {
                render = <input type="text" name={column} onChange={(e) => this.changeHandler(e)} onBlur={() => this.onBlur()} defaultValue={columnText} className="form-control" autoFocus={true}/>
        }

        else {
            render = columnText;
        }

        return (
            <div>
                {render}
            </div>
        );
    }
    
    columnClick(selectedColumn, insuranceContact) {
        this.setState({selectedColumn: selectedColumn, selectedRow: insuranceContact.insuranceContactId, insuranceContact: insuranceContact, anyChanges: false});
    }

    createInsuranceContactRow(insuranceContact)
    {
        return(
            <tr key={insuranceContact.insuranceContactId}>
                <td className="hidden">{insuranceContact.insuranceContactId}</td>
                <td className="hidden">{insuranceContact.insuranceId}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "title", insuranceContact)}>{this.showEditor("title", insuranceContact)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "firstName", insuranceContact)}>{this.showEditor("firstName", insuranceContact)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "lastName", insuranceContact)}>{this.showEditor("lastName", insuranceContact)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "phone", insuranceContact)}>{this.showEditor("phone", insuranceContact)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "ext", insuranceContact)}>{this.showEditor("ext", insuranceContact)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "fax", insuranceContact)}>{this.showEditor("fax", insuranceContact)}</td>
                <td tabIndex={this.state.tabIndex++} onFocus={this.columnClick.bind(this, "email", insuranceContact)}>{this.showEditor("email", insuranceContact)}</td>
            </tr>
        )
    }

    render() {
        return (
            <div className="formContainer">
                <h4>Insurance Contacts</h4>
                <hr />
                <div className="btn-group pull-right">
                    <button className="btn" onClick={this.open}>New</button>
                    <button className="btn" disabled={this.state.selectedRow === null ? true : false} onClick={this.deleteInsuranceContact}>Delete</button>
                    <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn"
                            table="insuranceContactsTable"
                            filename="InsuranceContacts"
                            sheet="insuranceContactsTable"
                            buttonText="Export to Excel"/>
                </div>
                <table id="insuranceContactsTable" className="table">
                    <thead>
                        <tr className="header">
                            <th className="hidden">InsuranceContactId</th>
                            <th className="hidden">InsuranceId</th>
                            <th>Title</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Ext</th>
                            <th>Fax</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.contacts.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                            this.state.contacts.map(i => this.createInsuranceContactRow(i))}
                    </tbody>
                </table>

                <InsuranceContactAddNewModal showModal={this.state.showModal}
                                             changeHandler={this.changeHandler}
                                             createInsuranceContact={this.createInsuranceContact}
                                             close={this.close}/>
            </div>
        )
    }
}