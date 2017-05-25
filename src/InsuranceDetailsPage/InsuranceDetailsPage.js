import React from 'react';
import InsuranceDetails from './InsuranceDetails';
import InsuranceDoctorsTable from './InsuranceDoctorsTable';
import InsuranceContactsTable from './InsuranceContactsTable';

export default class InsuranceDetailsPage extends React.Component {
    render() {
        return (
            <div className="formContainer">
                <InsuranceDetails insuranceId={this.props.match.params.insuranceId}/>

                <InsuranceDoctorsTable insuranceId={this.props.match.params.insuranceId}/>
                
                <InsuranceContactsTable insuranceId={this.props.match.params.insuranceId}/>
            </div>
        )
    }
}