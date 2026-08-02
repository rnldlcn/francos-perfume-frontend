import { useAuth } from "@/auth/UseAuth";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Archive, Edit, KeyRound, MinusSquareIcon, PlusSquareIcon } from "lucide-react";
import { useState } from "react";

const AccountInfoModal = ({ isOpen, onClose, selectedAccount, setSelectedAccount, archive, toggleStatus, resetPassword, setIsEditAccountModalOpen, }) => {
  
  const { user } = useAuth();
  const [config, setConfig] = useState(null);

  if (!isOpen || !selectedAccount) return null;

  /*
  //const currentRole = user?.trueRole?.toUpperCase() || user?.activeRole?.toUpperCase() || sessionStorage.getItem('activeRole')?.toUpperCase() || '';
  //const canModify = currentRole === 'OWNER' || currentRole === 'ADMIN';

    // THIS IS FOR ROLE-BASED
    {canModify && (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { onClose(); onEditClick(); }} className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] py-2.5 rounded-md font-medium transition-colors">Edit Account</button>
              <button onClick={() => setShowResetConfirm(true)} className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">Reset Password</button>
              <button onClick={() => setShowDeactivateConfirm(true)} className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">Deactivate Account</button>
              <button onClick={() => setShowDeactivateConfirm(true)} className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">Archive Account</button>
            </div>
          )}

      <EditAccountModal
      isOpen={isEditAccountModalOpen} 
      onClose={() => setIsEditAccountModalOpen(false)} 
      account={selectedAccount}
      />
    }
  */
  
  const accountId = selectedAccount.employeeId;
  const accountStatus = selectedAccount?.status?.toLowerCase();
  const isActive = accountStatus === "active";

  const handleEditAccount = () => {
      setIsEditAccountModalOpen(true);
      onClose();
  }

  const handleResetPassword = () => {
    setConfig({
      title: "Are you sure you want to reset the password for this account?",
      description: "The user of this account will be logged out and an email will be sent including their one-time generated password.",
      confirmText: "Reset Password",
      onConfirm: async () => {
        await resetPassword(accountId);
        setSelectedAccount(null);
        onClose();
      } 
    })
  }

  const handleToggleStatus = () => {
    const text = isActive ? "deactivate" : "activate"

    setConfig({
      title: `Are you sure you want to ${text} this account?`,
      description: isActive 
        ? "This account will no longer be able to log in."
        : "This account will regain access to the system.",
      confirmText: `${isActive ? "Deactivate" : "Activate"} Account`,
      onConfirm: async () => {
        await toggleStatus(accountId);
        setSelectedAccount(null);
        onClose();
      } 
    })
  }

  const handleArchiveAccount = () => {
    setConfig({
      title: "Are you sure you want to archive this account?",
      description: "This account will no longer exist in the accounts table.",
      confirmText: "Archive Account",
      onConfirm: async () => {
        await archive(accountId);
        setSelectedAccount(null);
        onClose();
      } 
    })
  } 

  // add DetailItem to reduce repetition

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="sm:max-w-2xl"
        >
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>

          <div className="p-8">

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">First name:</p>
                <p className="font-bold text-foreground text-lg">{selectedAccount.firstName || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Middle name:</p>
                <p className="font-bold text-foreground text-lg">{selectedAccount.middleName || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last name:</p>
                <p className="font-bold text-foreground text-lg">{selectedAccount.lastName || "N/A"}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Address:</p>
              <p className="font-bold text-foreground text-lg uppercase">{selectedAccount.address || "N/A"}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email:</p>
                <p className="font-bold text-foreground text-lg">{selectedAccount.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contact no.:</p>
                <p className="font-bold text-foreground text-lg">{selectedAccount.contactNumber || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Branch:</p>
                <p className="font-bold text-foreground text-lg">{selectedAccount.branchLocation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Role:</p>
                <p className="font-bold text-foreground text-lg uppercase">{selectedAccount.employeeRole}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status:</p>
                <p className="font-bold text-foreground text-lg uppercase">{accountStatus || "UNKNOWN"}</p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">
              <Button
                onClick={handleEditAccount}
              >
              <Edit />
              Edit Account
              </Button>

              <Button
                variant="destructive"
                onClick={handleResetPassword}
              >
                <KeyRound />
                Reset Password
              </Button>

              <Button
                variant={isActive ? "destructive" : "default"}
                onClick={handleToggleStatus}
              >
                {isActive ? <MinusSquareIcon /> : <PlusSquareIcon />}  
                {isActive ? "Deactivate Account" : "Reactivate Account"}
              </Button>

              <Button
                variant="destructive"
                onClick={handleArchiveAccount}
              >
                <Archive/>
                Archive Account
              </Button>
            </div>
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

export default AccountInfoModal;