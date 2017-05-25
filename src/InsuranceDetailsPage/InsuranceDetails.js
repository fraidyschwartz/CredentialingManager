import React from 'react';
import axios from 'axios';
import InsuranceDetailsForm from './InsuranceDetailsForm';

export default class InsuranceDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            insurance: {
                insuranceId: 0,
                name: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                zip: "",
                fax: "",
                email: "",
                groupContractNumber: "",
                notes: "",
                necessaryDocs: ""
            },
            facilities: [],
            disableFormControls: true,
        }
        this.makeFormEditable = this.makeFormEditable.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.checkboxHandler = this.checkboxHandler.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
    }

    async componentDidMount() {
        let insuranceDetails = await axios.get('/api/insurances/getinsurance?insuranceId=' + this.props.insuranceId);
        let facilities = await axios.get('/api/doctors/allfacilities');
        
        let facilityList = [];
        facilities.data.map(f => {
            f.selected = false;
            if(insuranceDetails.data.insuranceFacilities.includes(f.facilityId)) {
                f.selected = true;
            }
            facilityList.push(f);
        })
        this.setState({ insurance: insuranceDetails.data.insurance, 
                        facilities: facilityList });
    }

    makeFormEditable() {
        this.setState({disableFormControls: false})
    }

    async cancel() {
        event.preventDefault();
        let insuranceDetails = await axios.get('/api/insurances/getinsurance?insuranceId=' + this.props.insuranceId);
        this.setState({insurance: insuranceDetails.data.insurance, disableFormControls: true});
    }

    changeHandler(e) {
        e.preventDefault();
        let insurance = this.state.insurance;
        insurance[e.target.name] = e.target.value;
        this.setState({insurance});
    }

    checkboxHandler(e) {
        let facilities = this.state.facilities;

        if(e.target.checked) {
            facilities.find(f => f.facilityId == e.target.value).selected = true;
        }
        else {
            facilities.find(f => f.facilityId == e.target.value).selected = false;            
        }
        this.setState({facilities})
    }

    async save() {
        event.preventDefault();
        let insuranceFacilities = [];
        this.state.facilities.filter(f => f.selected === true).forEach(f => {
            insuranceFacilities.push(f.facilityId);
        })
        await axios.post('/api/insurances/editinsurance', {insurance: this.state.insurance, insuranceFacilities: insuranceFacilities});
        this.setState({disableFormControls: true});
    }

    render() {
        let render;

        if(this.state.insurance.insuranceId) {
            render = 
                <div className="formContainer"> 
                    <h3>{this.state.insurance.name}</h3>
                    <hr />

                    <div className="clearfix">
                        <div className="btn-group pull-right">
                            <button className="btn" onClick={this.state.disableFormControls === true ? this.makeFormEditable : this.cancel}>{this.state.disableFormControls === true ? "Edit" : "Cancel"}</button>
                            <button className="btn" onClick={this.save} disabled={this.disableFormControls}>Save</button>
                        </div>
                    </div>

                    <InsuranceDetailsForm insurance={this.state.insurance}
                        facilities={this.state.facilities}
                        disableFormControls={this.state.disableFormControls}
                        handler={this.changeHandler}
                        checkboxHandler={this.checkboxHandler}/>
                </div>
        }
        return (
            <div>
                {render}
            </div>
        )
    }
}