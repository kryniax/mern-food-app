import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { Restaurant, RestaurantSearchResponse } from "../types";
import { SearchState } from "../pages/SearchPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = (restaurantId?: string) => {
    const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
        const response = await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}`);

        if(!response.ok) {
            throw new Error("Failed to get restaurant");
        }

        return response.json();
    };

    const {
        data: restaurant,
        isLoading
    } = useQuery(
            "fetchRestaurant", 
            getRestaurantByIdRequest, 
            {
                enabled: !!restaurantId,
            }
        );

    return { restaurant, isLoading };
}

export const useSearchRestaurants = (searchState: SearchState, city?: string) => {
    const { getAccessTokenSilently } = useAuth0();

    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        const accessToken = await getAccessTokenSilently();
        const params = new URLSearchParams();
        params.set("searchQuery", searchState.searchQuery);
        params.set("page", searchState.page.toString());
        params.set("selectedCuisines", searchState.selectedCuisines.join(","));
        params.set("sortOption", searchState.sortOption);

        const response = await fetch(`${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`);

        if(!response.ok) {
            throw new Error("Failed to get restaurant");
        }
        
        return response.json();
    }

    const { 
        data: results, 
        isLoading 
    } = useQuery(
            ["searchRestaurant", searchState], 
            createSearchRequest,
            { enabled: !!city }
        );
    
    return {
        results,
        isLoading
    }
}