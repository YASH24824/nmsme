// hooks/useProfileCheck.js
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const useProfileCheck = () => {
  const { userData, loading } = useSelector((state) => state.profile);

  const checkProfileCompletion = (requiredRole = null) => {
    if (!userData) {
      toast.error("Please login to access this feature");
      return false;
    }

    if (requiredRole && userData.role !== requiredRole) {
      toast.error(`This feature is only available for ${requiredRole}s`);
      return false;
    }

    const minCompletion = userData.role === "seller" ? 92 : 100;

    if (
      !userData.has_complete_profile &&
      userData.profile_completion?.total < minCompletion
    ) {
      const completionPercentage = userData.profile_completion?.total || 0;
      return false;
    }

    return true;
  };

  return {
    userData,
    loading,
    checkProfileCompletion,
    isSeller: userData?.role === "seller",
    isBuyer: userData?.role === "buyer",
    hasCompleteProfile: userData?.has_complete_profile || false,
    profileCompletion: userData?.profile_completion?.total || 0,
  };
};
