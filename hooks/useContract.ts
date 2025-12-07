"use client";

/**
 * ============================================================================
 * IOTA CONTRACT INTEGRATION HOOK
 * ============================================================================
 *
 * This hook contains ALL the contract interaction logic.
 *
 * To customize your dApp, modify the configuration section below.
 *
 * ============================================================================
 */

import { useState } from "react";
import {
  useCurrentAccount,
  useIotaClient,
  useSignAndExecuteTransaction,
  useIotaClientQuery,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import { useNetworkVariable } from "@/lib/config";
import type { IotaObjectData } from "@iota/iota-sdk/client";

// ============================================================================
// CONTRACT CONFIGURATION
// ============================================================================
// Change these values to match your Move contract

export const CONTRACT_MODULE = "pizza"; // Your Move module name
export const CONTRACT_METHODS = {
  COOK: "cook",
  GET_FLAG: "get_flag",
} as const;

// ============================================================================
// DATA EXTRACTION
// ============================================================================
// Modify this to extract data from your contract's object structure

interface PizzaData {
  oliveOils: number;
  yeast: number;
  flour: number;
  water: number;
  salt: number;
  tomatoSauce: number;
  cheese: number;
  pineapple: number;
}

function getPizzaBoxFields(data: IotaObjectData): PizzaData | null {
  if (data.content?.dataType !== "moveObject") {
    console.log("Data is not a moveObject:", data.content?.dataType);
    return null;
  }

  const fields = data.content.fields as Record<string, unknown>;
  if (!fields || !fields.pizza) {
    console.log("No pizza fields found in object data");
    return null;
  }

  // Log the actual structure for debugging
  console.log("PizzaBox fields structure:", JSON.stringify(fields, null, 2));

  const pizza = fields.pizza as Record<string, unknown>;

  try {
    return {
      oliveOils: parseInt(String(pizza.olive_oils), 10),
      yeast: parseInt(String(pizza.yeast), 10),
      flour: parseInt(String(pizza.flour), 10),
      water: parseInt(String(pizza.water), 10),
      salt: parseInt(String(pizza.salt), 10),
      tomatoSauce: parseInt(String(pizza.tomato_sauce), 10),
      cheese: parseInt(String(pizza.cheese), 10),
      pineapple: parseInt(String(pizza.pineapple), 10),
    };
  } catch (error) {
    console.error("Error parsing pizza fields:", error);
    return null;
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export interface ContractData {
  oliveOils: number;
  yeast: number;
  flour: number;
  water: number;
  salt: number;
  tomatoSauce: number;
  cheese: number;
  pineapple: number;
}

export interface ContractState {
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash: string | undefined;
  error: Error | null;
}

export interface ContractActions {
  cookPizza: (
    oliveOils: number,
    yeast: number,
    flour: number,
    water: number,
    salt: number,
    tomatoSauce: number,
    cheese: number,
    pineapple: number
  ) => Promise<void>;
  getFlag: () => Promise<void>;
  clearObject: () => void;
}

export const useContract = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const packageId = useNetworkVariable("packageId");
  const iotaClient = useIotaClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [pizzaBoxId, setPizzaBoxId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && currentAccount?.address) {
      return localStorage.getItem(`pizzaBoxId_${currentAccount.address}`);
    }
    return null;
  });
  const [flagId, setFlagId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && currentAccount?.address) {
      return localStorage.getItem(`flagId_${currentAccount.address}`);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [transactionError, setTransactionError] = useState<Error | null>(null);

  // Fetch pizza box data
  const {
    data,
    isPending: isFetching,
    error: queryError,
    refetch,
  } = useIotaClientQuery(
    "getObject",
    {
      id: pizzaBoxId!,
      options: { showContent: true, showOwner: true },
    },
    {
      enabled: !!pizzaBoxId,
    }
  );

  // Extract fields
  const fields = data?.data ? getPizzaBoxFields(data.data) : null;

  // Check if object exists but data extraction failed
  const objectExists = !!data?.data;
  const hasValidData = !!fields;

  // Cook Pizza
  const cookPizza = async (
    oliveOils: number,
    yeast: number,
    flour: number,
    water: number,
    salt: number,
    tomatoSauce: number,
    cheese: number,
    pineapple: number
  ) => {
    if (!packageId) return;

    try {
      setTransactionError(null);
      setHash(undefined);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.pure.u16(oliveOils),
          tx.pure.u16(yeast),
          tx.pure.u16(flour),
          tx.pure.u16(water),
          tx.pure.u16(salt),
          tx.pure.u16(tomatoSauce),
          tx.pure.u16(cheese),
          tx.pure.u16(pineapple),
        ],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.COOK}`,
      });

      signAndExecute(
        { transaction: tx as never },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest);
            setIsLoading(true);
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              });
              const newPizzaBoxId = effects?.created?.[0]?.reference?.objectId;
              if (newPizzaBoxId) {
                setPizzaBoxId(newPizzaBoxId);
                if (typeof window !== "undefined" && address) {
                  localStorage.setItem(`pizzaBoxId_${address}`, newPizzaBoxId);
                }
                await refetch();
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.warn("No pizza box ID found in transaction effects");
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
              setIsLoading(false);
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            setTransactionError(error);
            console.error("Error:", err);
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTransactionError(error);
      console.error("Error cooking pizza:", err);
    }
  };

  // Get Flag
  const getFlag = async () => {
    if (!pizzaBoxId || !packageId) return;

    try {
      setTransactionError(null);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [tx.object(pizzaBoxId)],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.GET_FLAG}`,
      });

      signAndExecute(
        { transaction: tx as never },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest);
            setIsLoading(true);
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              });
              const newFlagId = effects?.created?.[0]?.reference?.objectId;
              if (newFlagId) {
                setFlagId(newFlagId);
                if (typeof window !== "undefined" && address) {
                  localStorage.setItem(`flagId_${address}`, newFlagId);
                }
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.warn("No flag ID found in transaction effects");
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
              setIsLoading(false);
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            setTransactionError(error);
            console.error("Error:", err);
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTransactionError(error);
      console.error("Error getting flag:", err);
    }
  };

  const contractData: ContractData | null = fields;

  const clearObject = () => {
    setPizzaBoxId(null);
    setFlagId(null);
    setTransactionError(null);
    if (typeof window !== "undefined" && address) {
      localStorage.removeItem(`pizzaBoxId_${address}`);
      localStorage.removeItem(`flagId_${address}`);
    }
  };

  const actions: ContractActions = {
    cookPizza,
    getFlag,
    clearObject,
  };

  const contractState: ContractState = {
    isLoading: isLoading,
    isPending,
    isConfirming: false,
    isConfirmed: !!hash && !isLoading && !isPending,
    hash,
    error: queryError || transactionError,
  };

  return {
    data: contractData,
    actions,
    state: contractState,
    pizzaBoxId,
    flagId,
    objectExists,
    hasValidData,
    isFetching,
  };
};
