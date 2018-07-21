const axios = require('../../config/axios');

const appId = 'c0bb7315-a84b-460c-a75a-a2d7daef4cf0';

module.exports = {
  sendNotifications: async (data) => {
    try {
      const response = await axios.post('', { ...data, appId });
      return response;
    } catch (error) {
      throw error;
    }
  },
  templates: {
    mileage: '357508bd-dfc0-4efe-a00d-4effe4a67b38',
    cnhExpiration: '7e813027-5cbe-4a74-acd7-4b063bba02bd',
    carLicensingExpiration: '58c31374-77f8-4ce3-b7cf-94c11894f7ef',
    fireExtinguisherExpiration: 'bbaf3e81-00fb-4f59-9410-d2b90bd9ae41',
    tiresState: '807f23fd-f2a6-4caa-b7da-6ec132f8abc5',
    oilLevel: '107113d6-aed1-4af8-9574-832a7cf17977',
    waterLevel: '53a76e08-1ed0-4ae6-b756-198ce89a7976',
    brakes: 'e7eb399c-a290-4276-b821-f1f11c1a6975',
    checkup: '1f7dc322-ad22-4c30-a9f4-891691011723',
    battery: 'a16223ee-f682-472d-bc01-0dae5ef50b06',
    phoneAndDirection: '4f0e78a9-1aae-4777-8425-dfae83d60134',
    drivingTips: '81e03956-849b-4d81-af27-7570f6706453',
    drinksAndDirection: '67a59c07-946c-46b4-bf58-a3188da25845',
    signaling: 'a90a246c-eb98-472c-8e7a-f72306b62804',
    somnolence: '5c6cb712-48ad-4ea4-b1b8-518f93358fe4',
    travels: '3d0e15da-3621-49e2-8a9e-d3d1d91d4194'
  }
};
