import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";

export default function DeleteAccount() {
    const { deleteAccount } = useUser(); // Mazací funkce definovaná v kontextu
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm("Are you absolutely sure you want to delete your account?");
        if (!confirmation) return;

        try {
            await deleteAccount(); 
            navigate("/"); 
        } catch (error) {
            console.log(error.message)
            const message = error.response?.data?.message || "Unable to delete account. Please try again.";
            alert(message);
        }
    };

    return (
        <div className="form-container">
            <div className="form-main justify-content-center align-items-center">
                <h3>Delete Account</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div>
                    <button 
                        id="button" 
                        onClick={handleDeleteAccount} 
                        style={{ backgroundColor: "#dc3545", color: "white" }}
                    >
                        Delete Account
                    </button>
                </div>
                <div className="homeContainer">
                    <button onClick={() => navigate("/")}>Go to Home</button>
                </div>
            </div>
        </div>
    );
}
