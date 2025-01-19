# Worble (Discord Bot)

---

## **Prerequisites**

### **General Requirements**
- [Node.js](https://nodejs.org) (LTS version recommended)
- [Git](https://git-scm.com/)

### **Optional (but Recommended)**
- [pnpm](https://pnpm.io/)

---

## **Bot Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/amgvu/Worble.git
cd worble
```

### **2. Install Dependencies**
Run the following command to install all necessary packages:
```bash
npm install
```
_If using `yarn` or `pnpm`, replace `npm install` with:_
```bash
yarn install
# OR
pnpm install
```

### **3. Run the Development Server**
Start the development server:
```bash
npm run dev
```
- Open `http://localhost:3000`

### **4. Supabase & Discord Integration**
Set up environment variables for Supabase & Discord.js:
1. Create a `.env.local` file in the root directory.
2. Add the following:
   ```env
    DISCORD_TOKEN=#################
    CLIENT_ID=#################
    GUILD_ID=#################

    SUPABASE_URL=#################
    SUPABASE_KEY=#################
   
   ```
3. Save the file.

---

## **Recommended VS Code Extensions**

### **For Dashboard Development**
- Tailwind CSS IntelliSense
- Supabase VS Code Extension
- ESLint for consistent formatting

---

## **Contributing**

Feel free to create GitHub issues for features, bug fixes, or documentation updates


`npx ts-node src/deploy-commands.ts`

for command redeployment
