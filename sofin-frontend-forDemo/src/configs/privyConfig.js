export const privyConfig = {
    loginMethods: [
      "wallet",
      "email",
      "google",
      "twitter",
      "apple",
      "discord",
      "github",
    ],
    appearance: {
      theme: "#F9F9F9",
    //   loginMessage: 'Welcome To Sofin APP!', 
    //   landingHeader: 'Your custom header text', 
    logo:"https://sofin.app/images/logo_dark.png",
    },
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
      noPromptOnSignature: true,
    },
};