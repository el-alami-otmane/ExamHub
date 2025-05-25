import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/auth';
import ExamForm from '../../components/ExamForm';

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/exams/${id}`,
          { headers: authService.getAuthHeader() }
        );
        setInitialData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load exam data');
      } finally {
        setLoading(false);
      }
    };
    fetchExamData();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/exams/${id}`,
        formData,
        {
          headers: {
            ...authService.getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      navigate('/admin/exams');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading exam data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!initialData) return <div>Exam not found</div>;

  return (
    <div>
      <h1>Edit Exam</h1>
      <ExamForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        isEditMode={true}
      />
    </div>
  );
};

export default EditExam;