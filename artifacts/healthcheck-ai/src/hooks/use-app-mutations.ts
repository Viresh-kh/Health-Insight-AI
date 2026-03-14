import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useCreateAssessment, useLogVitals } from "@workspace/api-client-react";

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useCreateAssessment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
        toast({
          title: "Assessment Complete",
          description: "Your health assessment has been analyzed successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error submitting assessment",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      },
    },
  });
}

export function useSubmitVitals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useLogVitals({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/vitals"] });
        toast({
          title: "Vitals Logged",
          description: "Your vital signs have been successfully recorded.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error logging vitals",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      },
    },
  });
}
