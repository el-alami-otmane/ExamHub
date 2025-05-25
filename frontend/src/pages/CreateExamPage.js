import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/auth';
import ExamForm from '../components/ExamForm';

const CreateExamPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await axios.post(
        'http://localhost:5000/api/exams',
        formData,
        { headers: authService.getAuthHeader() }
      );
      navigate('/admin/exams');
    } catch (error) {
      throw error;
    }
  };

  return <ExamForm onSubmit={handleSubmit} />;
};

export default CreateExamPage;