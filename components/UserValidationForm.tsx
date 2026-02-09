'use client';

import { useState } from 'react';
import { getValidGameTitles } from '@/lib/user-validation';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FormData {
    idPelanggan: string;
    idServer: string;
    gameTitle: string;
}

interface FieldError {
    [key: string]: string;
}

interface ValidationResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        idPelanggan: string;
        username: string;
        idServer: string;
        gameTitle: string;
    };
}

interface UserValidationFormProps {
    gameTitle: string;
}

export function UserValidationForm({ gameTitle }: UserValidationFormProps) {
    const [formData, setFormData] = useState<FormData>({
        idPelanggan: '',
        idServer: '',
        gameTitle: gameTitle,
    });
    const [fieldErrors, setFieldErrors] = useState<FieldError>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const validGameTitles = getValidGameTitles();

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'idPelanggan':
                if (!value.trim()) return '';
                if (value.length < 3) return 'ID Pelanggan minimal 3 karakter';
                if (value.length > 50) return 'ID Pelanggan maksimal 50 karakter';
                if (!/^[a-zA-Z0-9_-]+$/.test(value))
                    return 'ID Pelanggan hanya boleh alphanumeric, underscore, dan dash';
                return '';

            case 'idServer':
                if (!value.trim()) return '';
                if (value.length > 50) return 'ID Server maksimal 50 karakter';
                if (!/^[a-zA-Z0-9_-]+$/.test(value))
                    return 'ID Server hanya boleh alphanumeric, underscore, dan dash';
                return '';

            default:
                return '';
        }
    };

    const checkValidation = async (idPelanggan: string, idServer: string) => {
        if (!idPelanggan.trim() && !idServer.trim()) return;

        let hasError = false;
        const newErrors: FieldError = {};

        if (!idPelanggan.trim()) {
            newErrors.idPelanggan = 'ID pelanggan belum diisi';
            hasError = true;
        }

        if (!idServer.trim()) {
            newErrors.idServer = 'ID server belum diisi';
            hasError = true;
        }

        setFieldErrors(newErrors);

        if (hasError) {
            setValidationResponse(null);
            setValidationError(null);
            return;
        }

        const fieldValidationError1 = validateField('idPelanggan', idPelanggan);
        const fieldValidationError2 = validateField('idServer', idServer);

        if (fieldValidationError1 || fieldValidationError2) {
            setFieldErrors({
                idPelanggan: fieldValidationError1,
                idServer: fieldValidationError2,
            });
            setValidationResponse(null);
            setValidationError(null);
            return;
        }

        setIsLoading(true);
        setValidationError(null);
        setValidationResponse(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_SYNC_USER_URL || 'http://localhost:5050';
            const apiKey = process.env.NEXT_PUBLIC_API_SYNC_USER_KEY;

            const response = await fetch(`${apiUrl}/api/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || '',
                },
                body: JSON.stringify({
                    idPelanggan,
                    idServer,
                    gameTitle,
                    gameTitleX: validGameTitles.join(','),
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success' && data.message === 'Berhasil melakukan check') {
                setValidationResponse(data);
                setValidationError(null);
                setFieldErrors({});
            } else if (response.ok && data.status === 'success') {
                setValidationError('Response tidak sesuai dengan yang diharapkan');
                setValidationResponse(null);
            } else {
                setValidationError(data.message || 'Validasi gagal');
                setValidationResponse(null);
            }
        } catch (error) {
            setValidationError('Gagal terhubung ke server validasi');
            setValidationResponse(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name]) {
            const error = validateField(name, value);
            setFieldErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name, value);
        setFieldErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        checkValidation(
            name === 'idPelanggan' ? value : formData.idPelanggan,
            name === 'idServer' ? value : formData.idServer
        );
    };

    return (
        <div className="w-full space-y-4">
            <div>
                <label htmlFor="idPelanggan" className="block text-sm font-medium text-gray-700 mb-1">
                    ID Pelanggan <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="idPelanggan"
                    name="idPelanggan"
                    value={formData.idPelanggan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Masukkan ID Pelanggan"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors.idPelanggan
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                />
                {fieldErrors.idPelanggan && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                        <AlertCircle size={16} />
                        <span>{fieldErrors.idPelanggan}</span>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="idServer" className="block text-sm font-medium text-gray-700 mb-1">
                    ID Server <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="idServer"
                    name="idServer"
                    value={formData.idServer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Masukkan ID Server"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors.idServer
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                />
                {fieldErrors.idServer && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                        <AlertCircle size={16} />
                        <span>{fieldErrors.idServer}</span>
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Validasi sedang berjalan...</span>
                    </div>
                )}

                {validationError && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                        <AlertCircle size={16} />
                        <span>{validationError}</span>
                    </div>
                )}

                {validationResponse && validationResponse.status === 'success' && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                            <p className="font-medium text-green-800 text-sm">User & Server ID ditemukan</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
