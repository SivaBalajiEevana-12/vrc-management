import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Html5Qrcode } from "html5-qrcode";

const QrAttendanceScanner = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const html5QrCodeRef = useRef(null);
  const isScanning = useRef(false);
  const toast = useToast();

  const sendVerification = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://vrc-server-production.up.railway.app/verify/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setStatus(`✅ ${data.message}`);
        toast({
          title: "Scan Successful",
          description: data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        setStatus(`❌ ${data.message || "Verification failed."}`);
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid QR Code",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Network error");
      toast({
        title: "Network Error",
        description: "Could not verify the volunteer.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setScanCompleted(true);
    }
  };

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    html5QrCodeRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (!isScanning.current) {
            isScanning.current = true;

            try {
              await scanner.stop();
              await scanner.clear();
            } catch (e) {
              console.warn("Scanner stop failed:", e.message);
            }

            try {
              const url = new URL(decodedText);
              const pathParts = url.pathname.split("/");
              const userId = pathParts[pathParts.length - 1];
              if (userId) {
                await sendVerification(userId);
              } else {
                setStatus("❌ Invalid QR code format.");
                toast({
                  title: "Invalid QR Code",
                  description: "The scanned QR code is not in the expected format.",
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                });
                setScanCompleted(true);
              }
            } catch (err) {
              setStatus("❌ Invalid QR code.");
              toast({
                title: "Invalid QR Code",
                description: "Could not parse QR code.",
                status: "error",
                duration: 4000,
                isClosable: true,
              });
              setScanCompleted(true);
              console.error("URL parse error:", err.message);
            }
          }
        },
        (errorMessage) => {
          // Optional: handle scan errors
        }
      )
      .then(() => {
        isScanning.current = true;
      })
      .catch((err) => {
        setStatus("❌ Camera access error");
        toast({
          title: "Camera Error",
          description: "Unable to access camera for scanning.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        console.error("Start failed", err);
        setScanCompleted(true);
      });

    return () => {
      if (isScanning.current && scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch((e) => {
            console.warn("Cleanup stop error:", e.message);
          });
      }
    };
  }, []);

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={4}
      borderWidth="1px"
      borderRadius="xl"
      shadow="lg"
    >
      <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
        Volunteer QR Attendance
      </Text>

      {!scanCompleted && <Box id="reader" width="100%" />}

      {loading && <Spinner mt={4} size="md" />}
      {status && (
        <Alert mt={4} status={status.startsWith("✅") ? "success" : "error"}>
          <AlertIcon />
          {status}
        </Alert>
      )}

      {scanCompleted && (
        <Button
          mt={6}
          onClick={() => window.location.reload()}
          colorScheme="blue"
          width="full"
        >
          Scan Another
        </Button>
      )}
    </Box>
  );
};

export default QrAttendanceScanner;
