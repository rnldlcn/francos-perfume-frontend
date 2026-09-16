import ConfirmDialog from '@/components/shared/ConfirmDialog';
import FormField from '@/components/shared/FormField';
import FormSelect from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useAuth } from "../../../auth/UseAuth";

const getAccountFormData = (account) => ({
  firstName: account?.firstName || "",
  lastName: account?.lastName || "",
  middleName: account?.middleName || "",
  contactNumber: account?.contactNumber || "",
  address: account?.address || "",
  email: account?.email || "",
  branchLocation: account?.branchLocation || "",
  employeeRole: account?.employeeRole || "",
  employeeShift: account?.employeeShift || "",
});

const EditAccountModal = ({ isOpen, onClose, selectedAccount, filterOptions = [], updateDetails }) => {
  
  const { user } = useAuth();
  const [config, setConfig] = useState(null);

  const [data, setData] = useState(() => getAccountFormData(selectedAccount));

  useEffect(() => {
    if (isOpen && selectedAccount) {
      setData(getAccountFormData(selectedAccount));
    }
  }, [isOpen, selectedAccount]);

  if (!isOpen) return null;

  const branchOptionData = filterOptions.find(option => option.key === "branchLocation")?.options || [];
  const roleOptionData = filterOptions.find(option => option.key === "employeeRole")?.options || [];

  const branchOptions = branchOptionData.filter(
    (option) => option.value !== "" && option.value !== "__all__"
  );

  const roleOptions = roleOptionData.filter(
    (option) => option.value !== "" && option.value !== "__all__"
  );
  

  const handleSave = () => {
      setConfig({
      title: "Are you sure you want to save changes for this account?",
      description: "The user of this account will be notified of the changes made to their account.",
      confirmText: "Save Changes",
      onConfirm: async () => {
        console.log("Saving changes for account:", data);
        await updateDetails(selectedAccount.employeeId, data);
        setData(null);
        onClose();
      } 
    })
  }


  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="sm:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>

          <div className='grid grid-cols-3 gap-4 py-4'>
            <FormField 
              label="First Name"
              value={data.firstName}
              onChange={e => setData(prev => ({...prev, firstName: e.target.value }) )}
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

          <div className="grid grid-cols-2 gap-6 mb-8">
            <FormSelect
              label="Branch"
              value={data.branchLocation}
              onChange={(value) => setData(prev => ({...prev, branchLocation: value }))}
              options={branchOptions}
              placeholder="Select branch..."
              disabled={user?.trueRole?.toUpperCase() === "MANAGER"}
            />
            
            <FormSelect
              label="Role"
              value={data.employeeRole}
              onChange={(value) => setData(prev => ({...prev, employeeRole: value }))}
              options={roleOptions}
              placeholder="Select role..."
              disabled={user?.trueRole?.toUpperCase() === "MANAGER"}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        isOpen={!!config}
        onClose={() => setConfig(null)}
        config={config}
      />
    </>
  );
};

export default EditAccountModal;