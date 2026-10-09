export const PROGRAM_ID = "7qoQhJnnUd7dagxfiTafKQkAybc8kwyjYuxMm65jgAAn";

export const IDL = {
  address: PROGRAM_ID,
  metadata: {
    name: "nexus_vault",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "initializeVault",
      discriminator: [48, 191, 163, 44, 71, 129, 63, 164],
      accounts: [
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "authority",
              },
            ],
          },
        },
        {
          name: "authority",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "vaultState",
      discriminator: [211, 8, 232, 43, 2, 152, 117, 119],
    },
  ],
  types: [
    {
      name: "vaultState",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "pubkey" },
          { name: "name", type: "string" },
          { name: "totalDeposited", type: "u64" },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidName",
      msg: "Vault name must contain between 1 and 32 bytes.",
    },
  ],
} as const;