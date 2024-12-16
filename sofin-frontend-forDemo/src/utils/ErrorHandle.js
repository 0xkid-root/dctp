import { toast } from "react-toastify";


export const handleError = (error) => {
    const errorMap = {
      TransactionExecutionError: "User rejected the request",
      HttpRequestError: `A HTTP error occurred. Status: ${error.status}`,
      LimitExceededRpcError: `Rate limit exceeded. Code: ${error.code}`,
    };
    toast.error(errorMap[error.name] || "An unknown error occurred. Please try again.");
  };