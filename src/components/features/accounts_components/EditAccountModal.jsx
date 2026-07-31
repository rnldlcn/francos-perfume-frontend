import FormField from '@/components/shared/FormField';
import FormSelect from '@/components/shared/FormSelect';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useAuth } from "../../../auth/UseAuth";

const EditAccountModal = ({ isOpen, onClose, selectedAccount, }) => {
  
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    address: "",
    email: "",
    branchLocation: "",
    employeeRole: "",
    //can add employeeShift
  }) 

  const handleSave = () => {

  }


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isOpen && onClose()}>
      <DialogContent>
        
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-3 gap-4 py-4'>
          <div className="flex flex-col gap-2">
            <FormField 
              label="First Name"
              value={data.firstName}
              onChange={e => setData(prev => ({...prev, firstName: e.target.value }))}
              placeholder="Enter first name here..."
            />

            <FormField 
              label="Middle Name"
              value={data.middleName}
              onChange={e => setData(prev => ({...prev, middleName: e.target.value }))}
              placeholder="Enter middle name here..."
            />

            <FormField 
              label="Last Name"
              value={data.lastName}
              onChange={e => setData(prev => ({...prev, lastName: e.target.value }))}
              placeholder="Enter last name here..."
            />
          </div>
        </div>

        <div className='mb-6'>
          <FormField 
            label="Address"
            value={data.address}
            onChange={e => setData(prev => ({...prev, address: e.target.value }))}
            placeholder="Enter address here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField 
            label="Email"
            value={data.email}
            onChange={e => setData(prev => ({...prev, email: e.target.value }))}
            placeholder="Enter email here..."
          />
          <FormField 
            label="Contact Number"
            value={data.contactNumber}
            onChange={e => setData(prev => ({...prev, contactNumber: e.target.value }))}
            placeholder="Enter contact number here..."
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <FormSelect
            label="Branch"
            value={data.branchLocation}
            onChange={e => setData(prev => ({...prev, branchLocation: e.target.value }))}
            placeholder="Enter branch here..."
          />
          <FormField 
            label="Email"
            value={data.email}
            onChange={e => setData(prev => ({...prev, email: e.target.value }))}
            placeholder="Enter email here..."
          />
          <FormField 
            label="Contact Number"
            value={data.contactNumber}
            onChange={e => setData(prev => ({...prev, contactNumber: e.target.value }))}
            placeholder="Enter contact number here..."
          />
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountModal;