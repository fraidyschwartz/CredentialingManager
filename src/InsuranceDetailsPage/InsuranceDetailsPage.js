import React from 'react';
import axios from 'axios';
import InsuranceDetails from './InsuranceDetails';
import InsuranceDoctorsTable from './InsuranceDoctorsTable';
import InsuranceContactsTable from './InsuranceContactsTable';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export default class InsuranceDetailsPage extends React.Component { constructor() {
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

    async componentWillMount() {
        let insuranceDetails = await axios.get('/api/insurances/getinsurance?insuranceId=' + this.props.match.params.insuranceId);
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
        let insuranceDetails = await axios.get('/api/insurances/getinsurance?insuranceId=' + this.props.match.params.insuranceId);
        this.setState({insurance: insuranceDetails.data.insurance, disableFormControls: true});
    }

    changeHandler(e) {
        // e.preventDefault();
        let insurance = this.state.insurance;
        insurance[e.target.name] = e.target.value;
        this.setState({insurance});
    }

    checkboxHandler(e, facility) {
        let facilites = this.state.facilities.find(f => f.facilityId == e.target.value).selected = e.target.checked;
        this.setState({facilites})
        // let facilities = this.state.facilities;

        // if(e.target.checked) {
        //     facilities.find(f => f.facilityId == e.target.value).selected = true;
        // }
        // else {
        //     facilities.find(f => f.facilityId == e.target.value).selected = false;            
        // }
        // this.setState({facilities}, () => console.log(this.state.facilities))
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
        return (
            <div>
                <InsuranceDetails insurance={this.state.insurance}
                    checkboxHandler={this.checkboxHandler}
                    facilities={this.state.facilities}
                    disableFormControls={this.state.disableFormControls}
                    makeFormEditable={this.makeFormEditable}
                    changeHandler={this.changeHandler}
                    save={this.save}
                    cancel={this.cancel}/>

                <br />
                <InsuranceDoctorsTable insuranceId={this.props.match.params.insuranceId}/>
                
                <br />
                <InsuranceContactsTable insuranceId={this.props.match.params.insuranceId}/>
            </div>
        )
    }
}