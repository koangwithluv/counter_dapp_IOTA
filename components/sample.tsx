"use client";

/**
 * ============================================================================
 * PIZZA BOX DAPP INTEGRATION COMPONENT
 * ============================================================================
 *
 * This component allows users to cook pizzas and get flags when they cook
 * the perfect pizza with the right ingredients.
 *
 * All the contract logic is in hooks/useContract.ts
 *
 * ============================================================================
 */

import { useCurrentAccount } from "@iota/dapp-kit";
import { useContract } from "@/hooks/useContract";
import { Button, Container, Heading, Text, TextField } from "@radix-ui/themes";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";

const SampleIntegration = () => {
  const currentAccount = useCurrentAccount();
  const { data, actions, state, pizzaBoxId, flagId } = useContract();

  const [ingredients, setIngredients] = useState({
    oliveOils: "10",
    yeast: "3",
    flour: "98",
    water: "114",
    salt: "18",
    tomatoSauce: "200",
    cheese: "180",
    pineapple: "0",
  });

  const isConnected = !!currentAccount;

  const handleIngredientChange = (field: string, value: string) => {
    setIngredients((prev) => ({ ...prev, [field]: value }));
  };

  if (!isConnected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }}>
            🍕 Pizza Box dApp
          </Heading>
          <Text>Please connect your wallet to cook pizzas!</Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem",
        background: "var(--gray-a2)",
      }}
    >
      <Container style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Heading size="6" style={{ marginBottom: "2rem" }}>
          🍕 Pizza Box dApp
        </Heading>

        {/* Flag Status */}
        {flagId && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1.5rem",
              background: "var(--green-a3)",
              borderRadius: "8px",
              border: "2px solid var(--green-7)",
            }}
          >
            <Heading size="4" style={{ marginBottom: "0.5rem" }}>
              🎉 Congratulations! Flag Captured!
            </Heading>
            <Text
              style={{
                color: "var(--green-11)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              You&apos;ve cooked the perfect pizza and earned your flag!
            </Text>
            <Text
              size="1"
              style={{
                color: "var(--gray-a11)",
                display: "block",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              Flag ID: {flagId}
            </Text>
          </div>
        )}

        {/* Pizza Box Status */}
        {pizzaBoxId && data && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              background: "var(--gray-a3)",
              borderRadius: "8px",
            }}
          >
            <Text
              size="2"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Your Pizza Box 📦
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Text size="2">Olive Oils: {data.oliveOils}</Text>
              <Text size="2">Yeast: {data.yeast}</Text>
              <Text size="2">Flour: {data.flour}</Text>
              <Text size="2">Water: {data.water}</Text>
              <Text size="2">Salt: {data.salt}</Text>
              <Text size="2">Tomato Sauce: {data.tomatoSauce}</Text>
              <Text size="2">Cheese: {data.cheese}</Text>
              <Text size="2">Pineapple: {data.pineapple}</Text>
            </div>
            <Text
              size="1"
              style={{
                color: "var(--gray-a11)",
                display: "block",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              PizzaBox ID: {pizzaBoxId}
            </Text>

            {!flagId && (
              <Button
                size="2"
                style={{ marginTop: "1rem" }}
                onClick={actions.getFlag}
                disabled={state.isLoading || state.isPending}
              >
                {state.isLoading || state.isPending ? (
                  <>
                    <ClipLoader size={14} style={{ marginRight: "8px" }} />
                    Checking...
                  </>
                ) : (
                  "🚩 Get Flag"
                )}
              </Button>
            )}
          </div>
        )}

        {/* Cook Pizza Form */}
        <div
          style={{
            padding: "1.5rem",
            background: "var(--gray-a3)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <Heading size="4" style={{ marginBottom: "1rem" }}>
            Cook a Pizza 👨‍🍳
          </Heading>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Olive Oils
              </Text>
              <TextField.Root
                value={ingredients.oliveOils}
                onChange={(e) =>
                  handleIngredientChange("oliveOils", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Yeast
              </Text>
              <TextField.Root
                value={ingredients.yeast}
                onChange={(e) =>
                  handleIngredientChange("yeast", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Flour
              </Text>
              <TextField.Root
                value={ingredients.flour}
                onChange={(e) =>
                  handleIngredientChange("flour", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Water
              </Text>
              <TextField.Root
                value={ingredients.water}
                onChange={(e) =>
                  handleIngredientChange("water", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Salt
              </Text>
              <TextField.Root
                value={ingredients.salt}
                onChange={(e) => handleIngredientChange("salt", e.target.value)}
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Tomato Sauce
              </Text>
              <TextField.Root
                value={ingredients.tomatoSauce}
                onChange={(e) =>
                  handleIngredientChange("tomatoSauce", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Cheese
              </Text>
              <TextField.Root
                value={ingredients.cheese}
                onChange={(e) =>
                  handleIngredientChange("cheese", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Pineapple 🍍
              </Text>
              <TextField.Root
                value={ingredients.pineapple}
                onChange={(e) =>
                  handleIngredientChange("pineapple", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
          </div>

          <Button
            size="3"
            onClick={() =>
              actions.cookPizza(
                parseInt(ingredients.oliveOils),
                parseInt(ingredients.yeast),
                parseInt(ingredients.flour),
                parseInt(ingredients.water),
                parseInt(ingredients.salt),
                parseInt(ingredients.tomatoSauce),
                parseInt(ingredients.cheese),
                parseInt(ingredients.pineapple)
              )
            }
            disabled={state.isPending || state.isLoading}
          >
            {state.isLoading ? (
              <>
                <ClipLoader size={16} style={{ marginRight: "8px" }} />
                Cooking...
              </>
            ) : (
              "🍕 Cook Pizza"
            )}
          </Button>
        </div>

        {/* Transaction Status */}
        {state.hash && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--gray-a3)",
              borderRadius: "8px",
            }}
          >
            <Text size="1" style={{ display: "block", marginBottom: "0.5rem" }}>
              Transaction Hash
            </Text>
            <Text
              size="2"
              style={{ fontFamily: "monospace", wordBreak: "break-all" }}
            >
              {state.hash}
            </Text>
            {state.isConfirmed && (
              <Text
                size="2"
                style={{
                  color: "green",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                ✅ Transaction confirmed!
              </Text>
            )}
          </div>
        )}

        {/* Error Display */}
        {state.error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--red-a3)",
              borderRadius: "8px",
            }}
          >
            <Text style={{ color: "var(--red-11)" }}>
              Error: {(state.error as Error)?.message || String(state.error)}
            </Text>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SampleIntegration;
