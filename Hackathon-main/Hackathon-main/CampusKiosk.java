import java.util.HashMap;
import java.util.Scanner;

public class CampusKiosk {
    public static void main(String[] args) {
        // Initialize campus room directions
        HashMap<String, String> campusMap = new HashMap<>();
        campusMap.put("E201", "Block E, 2nd Floor. Use the eastern stairwell and turn left.");
        campusMap.put("A105", "Block A, 1st Floor. Walk past the main registration desk on your right.");
        campusMap.put("M302", "Block M, 3rd Floor. Please use the central library elevator for access.");
        campusMap.put("L208", "Block L, 2nd Floor. Take the central elevator up, turn right past the student lounge.");

        Scanner scanner = new Scanner(System.in);
        int paperSavedCounter = 0;
        double carbonSavedKg = 0.0;
        int userPoints = 0;

        while (true) {
            System.out.println("\n+-------------------------------------------------+");
            System.out.println("|      CENTENNIAL ECO-WAYFINDER MOBILE v2.5       |");
            System.out.println("+-------------------------------------------------+");
            System.out.println("|    [1] Search Room  [2] View Eco-Points  [3] Exit |");
            System.out.println("+-------------------------------------------------+");
            System.out.print("👉 ENTER ROOM CODE (or type 'EXIT'): ");
            
            String inputRoom = scanner.nextLine().toUpperCase().trim();

            if (inputRoom.equals("EXIT")) {
                System.out.println("\n+-------------------------------------------------+");
                System.out.println("|         FINAL ECO-SESSION METRIC REPORT         |");
                System.out.println("+-------------------------------------------------+");
                System.out.println("| 📦 Total Printed Maps Prevented: " + paperSavedCounter);
                System.out.printf("| 🧊 Cumulative Carbon Offset: %.3f kg CO2\n", carbonSavedKg);
                System.out.println("| 🏆 Student Loyalty Points Earned: " + userPoints);
                System.out.println("+-------------------------------------------------+");
                System.out.println("|     THANK YOU FOR DRIVING A GREENER CAMPUS!     |");
                System.out.println("+-------------------------------------------------+");
                break;
            }

            System.out.println("\n+-------------------------------------------------+");
            System.out.println("|                PROCESSING ROUTE                 |");
            System.out.println("+-------------------------------------------------+");

            if (campusMap.containsKey(inputRoom)) {
                paperSavedCounter++;
                carbonSavedKg += 0.015;
                userPoints += 50;

                System.out.println(" 📍 DESTINATION: Room " + inputRoom);
                System.out.println(" 🗺️ DIRECTIONS : " + campusMap.get(inputRoom));
                System.out.println(" -------------------------------------------------");
                System.out.println(" 🌱 ENVIRONMENTAL FOOTPRINT IMPACT:");
                System.out.println("   » Landfill Waste Saved : +1 Map Document");
                System.out.printf("   » CO2 Emissions Prevented: %.3f kg\n", carbonSavedKg);
                System.out.println("   » Gamification Reward  : +50 Student Eco-Points");
            } else {
                System.out.println(" ❌ ERROR: Room '" + inputRoom + "' is not in the system registry.");
                System.out.println("   » Please verify input or try: E201, A105, M302, L208");
            }

            System.out.println("+-------------------------------------------------+");
            System.out.print("\nPress Enter to clear screen and search again...");
            scanner.nextLine();
        }

        scanner.close();
    }
}