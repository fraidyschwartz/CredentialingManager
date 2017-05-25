import React from 'react';
import InsuranceDetails from './InsuranceDetails';
import InsuranceDoctorsTable from './InsuranceDoctorsTable';
import InsuranceContactsTable from './InsuranceContactsTable';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export default class InsuranceDetailsPage extends React.Component {
    render() {
        return (
            <div>
                <InsuranceDetails insuranceId={this.props.match.params.insuranceId}/>

                <br />
                <InsuranceDoctorsTable insuranceId={this.props.match.params.insuranceId}/>
                
                <br />
                <InsuranceContactsTable insuranceId={this.props.match.params.insuranceId}/>
            </div>
        )
    }
}