from inventory.inventory import Inventory
class ResourceCenter:
    def __init__(self):
        ## Prepare the data (Inventory list)
        self.inventory = Inventory()

    def display_menu(self):
        choice = -1
        while not 1 <= choice <= 5:
            print("\n==============================================")
            print('RESOURCE CENTRE SYSTEM:')
            print("1. Add item")
            print("2. Display Inventory")
            print("3. Loan item")
            print("4. Return item")
            print("5. Quit")
            choice = int(input("Enter your choice >"))
            if not 1 <= choice <= 5:
                print("Invalid choice, please enter again.\n")
        return choice

    def main(self):
        # Refactor (A): Extract constants for choice integers
        # Refactor (A): Extract constants for option integers

        #### Menu driven application ####
        # Display menu and obtain menu choices
        choice = self.display_menu()

        while choice != 5:

            if choice == 1:
                # Refactor (B): use printHeader(mesage)
                print("")
                print("==============================================")
                print("Add an item")
                print("==============================================")
                
                # Refactor (B): Extract duplicate codes to selectItemType(),
                # return the option selected.
                # Advance refactoring: error chekcing in selectItemType().
                print("\nItem types:")
                print("1. Digital Camera")
                print("2. Laptop")
                option = int(input("Enter option to select item type >"))

                # TO-DO: Write the code to ADD a camcorder or chrome book.
                # TO-DO: Write the code to ADD a digital camera or laptop.
                if option == 1:
                      assetTag = input("Enter asset tag >")
                      description = input("Enter descrition >")
                      opticalzoom = int(input("Enter optical zoom >"))
                      result = self.inventory.addCamera(assetTag, description, opticalzoom)
   
                      if result:
                        print("Digital camera added.")

                      else:
                         print("Error adding digital camera.")

            
            elif choice == 2:
                # Refactor (B): Extract duplicate codes to printHeader(message)
             print("")
             print("==============================================")
             print("Display all items")
             print("==============================================")

                # TO-DO: Write the code to ADD a camcorder or chrome book.
                
            elif choice == 3:
                # Refactor (B): use printHeader(mesage)
                print("")
                print("==============================================")
                print("Loan an item")
                print("==============================================")
                
                # Refactor (B): use selectItemType()
                print("\nItem types:")
                print("1. Digital Camera")
                print("2. Laptop")
                option = int(input("Enter option to select item type >"))

                # TO-DO: Write the code to LOAN a camcorder or chrome book
                
            elif choice == 4:
                # Refactor (B): use printHeader(mesage)
                print("")
                print("==============================================")
                print("Return an item")
                print("==============================================")
                
                # Refactor (B): use selectItemType()
                print("\nItem types:")
                print("1. Digital Camera")
                print("2. Laptop")
                option = int(input("Enter option to select item type >"))

                # TO-DO: Write the code to RETURN a camcorder or chrome book

            else:
                print("Invalid choice.")
            
            choice = self.display_menu()

        print("Good bye.")

if __name__ == "__main__":
    app = ResourceCenter()
    app.main()